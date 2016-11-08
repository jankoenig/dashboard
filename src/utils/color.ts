import Numbers from "./numbers";

export namespace Color {

    export type RGB = {
        r: number;
        g: number;
        b: number;
    }

    export type HSV = {
        hue: number;
        saturation: number;
        value: number;
    }

    /**
     * Converts a hex color to RGB
     *
     * Source: http://stackoverflow.com/a/5624139/1349766
     *
     * @export
     * @param {string} hex
     * @returns {Color.RGB}
     */
    export function HEX2RGB(hex: string): Color.RGB {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : undefined;
    };

    /**
     * Converts an RGB color to HEX
     *
     * Source: http://stackoverflow.com/a/5624139/1349766
     *
     * @export
     * @param {Color.RGB} rgb
     * @returns {string}
     */
    export function RGB2HEX(rgb: Color.RGB): string {
        return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
    }

    /**
     * Converts a RGB color to HSV
     *
     * Source: http://stackoverflow.com/a/1664186/1349766
     *
     * @export
     * @param {Color.RGB} rgb
     * @returns {Color.HSV}
     */
    export function RGB2HSV(rgb: Color.RGB): Color.HSV {

        let hsv: Color.HSV = { hue: 0, saturation: 0, value: 0 };
        let max = Numbers.max(rgb.r, rgb.g, rgb.b);
        let dif = max - Numbers.min(rgb.r, rgb.g, rgb.b);

        hsv.saturation = (max === 0.0) ? 0 : (100 * dif / max);

        if (hsv.saturation === 0) {
            hsv.hue = 0;
        } else if (rgb.r === max) {
            hsv.hue = 60.0 * (rgb.g - rgb.b) / dif;
        } else if (rgb.g === max) {
            hsv.hue = 120.0 + 60.0 * (rgb.b - rgb.r) / dif;
        } else if (rgb.b === max) {
            hsv.hue = 240.0 + 60.0 * (rgb.r - rgb.g) / dif;
        }

        if (hsv.hue < 0.0) {
            hsv.hue += 360.0;
        }

        hsv.value = Numbers.round(max * 100 / 255, 1);
        hsv.hue = Numbers.round(hsv.hue, 1);
        hsv.saturation = Numbers.round(hsv.saturation, 1);

        return hsv;
    }


    /**
     * Converts HSV color to RGB
     *
     * RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
     * which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
     *
     * Source: http://stackoverflow.com/a/1664186/1349766
     *
     * @export
     * @param {Color.HSV} hsv
     * @returns {Color.RGB}
     */
    export function HSV2RGB(hsv: Color.HSV): Color.RGB {

        let rgb = { r: 0, g: 0, b: 0 };

        if (hsv.saturation === 0) {
            rgb.r = rgb.g = rgb.b = Math.round(hsv.value * 2.55);
        } else {
            hsv.hue /= 60;
            hsv.saturation /= 100;
            hsv.value /= 100;

            let i = Math.floor(hsv.hue);
            let f = hsv.hue - i;
            let p = hsv.value * (1 - hsv.saturation);
            let q = hsv.value * (1 - hsv.saturation * f);
            let t = hsv.value * (1 - hsv.saturation * (1 - f));

            switch (i) {
                case 0: rgb.r = hsv.value; rgb.g = t; rgb.b = p; break;
                case 1: rgb.r = q; rgb.g = hsv.value; rgb.b = p; break;
                case 2: rgb.r = p; rgb.g = hsv.value; rgb.b = t; break;
                case 3: rgb.r = p; rgb.g = q; rgb.b = hsv.value; break;
                case 4: rgb.r = t; rgb.g = p; rgb.b = hsv.value; break;
                default: rgb.r = hsv.value; rgb.g = p; rgb.b = q;
            }

            rgb.r = Math.round(rgb.r * 255);
            rgb.g = Math.round(rgb.g * 255);
            rgb.b = Math.round(rgb.b * 255);
        }

        return rgb;
    }

    /**
     * Shifts the hue by the amount provided
     *
     * Source: http://stackoverflow.com/a/1664186/1349766
     *
     * @export
     * @param {number} h Hue of HSV
     * @param {number} s Amount to shift
     * @returns {number} New value for Hue
     */
    export function hueShift(h: number, s: number): number {
        h += s;

        while (h >= 360.0) {
            h -= 360.0;
        }

        while (h < 0.0) {
            h += 360.0;
        }

        return h;
    }

    export function complementaryColor(hex: string) {
        // First convert to RGB
        let rgb = Color.HEX2RGB(hex);

        // Then to HSV
        let hsv = Color.RGB2HSV(rgb);

        // Then shift
        let complementaryHsv = {
            hue: Color.hueShift(hsv.hue, 180),
            saturation: hsv.saturation,
            value: hsv.value
        };

        // Then back to RGB
        let complementaryRgb = Color.HSV2RGB(complementaryHsv);

        // Then back to hex, returning
        return Color.RGB2HEX(complementaryRgb);
    }
}

export default Color;
