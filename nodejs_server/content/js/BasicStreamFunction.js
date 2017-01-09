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
        delay: function () {
            //おそらくStreamManagerで処理する必要がある
            /************************************************************************ 
            observable.delay(delay) はミリ秒単位の総量によってストリーム/プロパティを遅延させます。Property の初期値は遅延させません。

            var delayed = source.delay(2)
            source:    asdf----asdf----
            delayed:   --asdf----asdf--
            observable.throttle(delay) はミリ秒単位の量でストリーム/プロパティを throttle させます。 イベントは delay　の最小の間隔でエミットされます。実装は stream.bufferWithTime にもとづいています。 Property の初期値をエミットする影響はありません。

            例

            var throttled = source.throttle(2)
            source:    asdf----asdf----
            throttled: --s--f----s--f--
            observable.debounce(delay) はミリ秒単位の量でストリーム/プロパティを throttle します。 「quiet period」の後にのみイベントはエミットされます。Property の初期値のエミットには影響を及ぼしません。 throttle と debounce の違いは jQuery の同名のメソッドと同じです。

            例

            source:             asdf----asdf----
            source.debounce(2): -----f-------f--
            observable.debounceImmediate(delay) はストリームの最初のイベントを pass しますが、その他、以前の出力から任意のミリ秒が pass した後にかぎり、イベントが pass します。

            例

            source:                      asdf----asdf----
            source.debounceImmediate(2): a-d-----a-d-----
            *****************************************************************************/
        }
    }

});