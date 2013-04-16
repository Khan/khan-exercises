$.extend(KhanUtil, {
    commonAngles: [
        {deg: 15, rad: "\\frac{\\pi}{12}"},
        {deg: 30, rad: "\\frac{\\pi}{6}"},
        {deg: 45, rad: "\\frac{\\pi}{4}"},
        {deg: 60, rad: "\\frac{\\pi}{3}"},
        {deg: 90, rad: "\\frac{\\pi}{2}"},
        {deg: 120, rad: "\\frac{2\\pi}{3}"},
        {deg: 135, rad: "\\frac{3\\pi}{4}"},
        {deg: 150, rad: "\\frac{5\\pi}{6}"},
        {deg: 180, rad: "\\pi"},
        {deg: 210, rad: "\\frac{7\\pi}{6}"},
        {deg: 225, rad: "\\frac{5\\pi}{4}"},
        {deg: 240, rad: "\\frac{4\\pi}{3}"},
        {deg: 270, rad: "\\frac{3\\pi}{2}"},
        {deg: 300, rad: "\\frac{5\\pi}{3}"},
        {deg: 315, rad: "\\frac{7\\pi}{4}"},
        {deg: 330, rad: "\\frac{11\\pi}{6}"},
        {deg: 360, rad: "2\\pi"}
    ],

    // Convert a degree value to a radian value
    toRadians: function(degrees) {
        return degrees * Math.PI / 180;
    },

    // Convert a radian value to a degree value
    toDegrees: function(radians) {
        return radians * 180 / Math.PI;
    },

    wrongCommonAngle: function(angleIdx, i) {
        // i is a value from 1 to 3
        return KhanUtil.commonAngles[(angleIdx + (4 * i)) % KhanUtil.commonAngles.length];
    },

    wrongDegrees: function(degrees) {
        var offset;
        var wrong;

        do {
            offset = KhanUtil.randRange(10, 35);
            if (KhanUtil.rand(2)) {
                offset *= -1;
            }

            wrong = degrees + offset;
        } while (!(wrong >= 0 && wrong <= 360));

        return wrong;
    },

    wrongRadians: function(radians) {
        var offset;
        var wrong;

        do {
            offset = KhanUtil.randRange(10, 35) / 100;
            if (KhanUtil.rand(2)) {
                offset *= -1;
            }

            wrong = KhanUtil.roundTo(2, radians + offset);
        } while (!(wrong >= 0 && wrong <= 2 * Math.PI));

        return wrong;
    }
});
