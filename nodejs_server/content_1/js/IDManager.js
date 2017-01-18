define(function () {
    return {
        //UUID生成
        generateUUID: function (length) {
            var s = "";
            length = length || 32;
            for (i = 0; i < length; i++) {
                random = Math.random() * 16 | 0;
                s += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
            }
            return s;
        },
        //groupID+UUIDからgroupIDを抽出
        getGroupID: function (id) {
            var ID = id.split("/");
            return ID[0];
        }
    }
})