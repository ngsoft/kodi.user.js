

const runat = {
    /**
     * Run at document start
     * @returns {Promise}
     */
    documentStart: function () {
        return new Promise();
    },
    /**
     * Run at document body
     * @returns {Promise}
     */
    documentBody: function () {
        return new Promise();
    },
    /**
     * Run at document end
     * @returns {Promise}
     */
    documentEnd: function () {
        return new Promise();
    },
    /**
     * Run at document idle
     * @returns {Promise}
     */
    documentIdle: function () {
        return new Promise();
    }


};

root.runat = runat;