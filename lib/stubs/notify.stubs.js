const notify = {
    getIziToast: function(){
        return new Promise();
    },
    toast:function toast(message, title = '', method = 'info'){
        return new Promise();
    },

    success: function(message, title = ''){
        return new Promise();
    },
    error: function(message, title = ''){
        return new Promise();
    },
    notice: function(message, title = ''){
        return new Promise();
    },
    message: function(message, title = ''){
        return new Promise();
    },
    warn: function(message, title = ''){
        return new Promise();
    },
    title: ''
};


root.notify = notify;