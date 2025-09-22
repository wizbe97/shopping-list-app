import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  PixelRatio,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
} from "react-native";

type Props = {
  children: React.ReactNode;
};

type FontScaleContextType = {
  scaleFont: (size: number) => number;
};

const FontScaleContext = createContext<FontScaleContextType>({
  scaleFont: (size: number) => size,
});

export function useFontScale() {
  return useContext(FontScaleContext);
}

type AppTextProps = TextProps & {
  style?: StyleProp<TextStyle>;
  fontSize?: number;
};

export function AppText({ style, children, fontSize, ...rest }: AppTextProps) {
  const { scaleFont } = useFontScale();

  const flatStyle: TextStyle =
    Array.isArray(style) ? Object.assign({}, ...style) : (style as TextStyle);

  // Default font size even smaller now → 10
  let extractedFontSize = fontSize ?? (flatStyle?.fontSize as number) ?? 10;

  return (
    <Text
      {...rest}
      style={[style, { fontSize: scaleFont(extractedFontSize) }]}
    >
      {children}
    </Text>
  );
}

export default function ScreenWrapper({ children }: Props) {
  const [windowDims, setWindowDims] = useState(Dimensions.get("window"));

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowDims(window);
    });
    return () => subscription?.remove();
  }, []);

  const scaleFont = (size: number) => {
    const { width } = windowDims;

    const baseWidth = 375; // iPhone X baseline
    let scale = width / baseWidth;

    if (scale < 1) {
      // Shrink more aggressively on small widths
      scale = scale * 0.75; // text ~25% smaller than proportional shrink
    } else {
      // Dampening for large widths (desktop / tablet)
      scale = 1 + (scale - 1) * 0.25;
    }

    const newSize = Math.max(size * scale, 8); // don’t go below 8px
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

  const contextValue = useMemo(
    () => ({ scaleFont }),
    [windowDims.width]
  );

  return (
    <FontScaleContext.Provider value={contextValue}>
      <View style={styles.container}>{children}</View>
    </FontScaleContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: "10%",
    paddingVertical: 12,
    paddingTop: "15%",
  },
});
