define([], function () {
    return {
        combine2: function (e1, e2) {
            console.log("combine 2 stream");
            $.extend(true, e1, e2);
            return e1;
        },
        combine3: function (e1, e2, e3) {
            console.log("combine 3 stream");
            $.extend(true, e1, e2, e3);
            return e1;
        },
        combine4: function (e1, e2, e3, e4) {
            console.log("combine 4 stream");
            $.extend(true, e1, e2, e3, e4);
            return e1;
        },
        combine5: function (e1, e2, e3, e4,e5) {
            console.log("combine 5 stream");
            $.extend(true, e1, e2, e3, e4, e5);
            return e1;
        },
    }

});