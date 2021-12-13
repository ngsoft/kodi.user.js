// ==UserScript==
// @version     21.12.2
// @name        KodiCast
// @description Cast your streams to Kodi
// @author      Aymeric Anger
// @namespace   https://github.com/ngsoft/kodi.user.js
//
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEAklEQVR42rVXv4/cRBRee3fvghSIsnd+45UQPZQUJLT8D9TUqSOlAoIoAgU/FYQIhBqC9uJ5s4sijoqaAhBFDtCl4Ow3eyL05O58Rva8sWe8vkSXvbW0Wlvr9ffN9733zXOvd8pDIAX2HJDeBqSPxUQPy+tIUthb5dEC/wSQCoFUgKTkfJJWJGBVJGKVtcB1IZQ+BKUfVSSQ8PyWIRFhdrYkRCc4HQHScfkpiVgSG1v7g5XZAUifVrIrfWSAq/OiItKQSJ6zSsjGsqVXD0jXS/ASiFddOApU5wKr38rz70bf/js8s5Vv3H0QAtKfDHQEqrKgAq4+LomqLqiIkF5j4stbcUE9CEHRHwJ1AYpyYSR3QY9bNqjonl53rAtO67X3h2cNgZ2aAK/ckb+8PmDwe5uT/bWu1Z+aSG3BpLJgh8HyFnj5fcDeb4utOYNnfQf45ejuw/5jLXHZCaS3AOml+vqb3VAg7YDxO3dkLxzwH+NJeo7DaOA893P+/c5omg2ZXNgCd/pc0Ycm4bJXTRfoEJLdkxQw4JK2x13gkm4xyZxJ4MVZ6pMQsgGPUH/AFV6Ayl4xasxDoXZDoeg+B1DeWvn25p1/1rnvu8CPmHQdVhe/TwcLdgik9/kPh6zAJaPAPASsFLjvKGDBfxhN9quVR0knuJ8ZLglMhw54dqNhq3NzExNAQ6BRQD+yno9VLbtbcF/4ablQsHViAs4H5crfFCbhrFSmuGR22VikQ1CeAj44Ul+wn6D0dVC1PV3gVomDymakWyX7G6KRa4EAyHko8K9Sgd+t52OVPuO2WjxNbYu9K9AlUN5vAovDyytegfS1le1mQ8K3IOb2BEUakH6K5d66BRdKB88ne4E7AwDS7Wa39NLSkqjT8kLy95qbA5+JjiKMcS8YzR6GgPoNkNmIwQcLOeLVgb79hCKcisSkpbdlNiSaNgTVPJh3R7fg3gOkCUiKmcRwkUQ1N+S8i1pwf3rqIgFIl7k9+0wkAAdcKK52c+8vGzIb87NcEl/ZIBLmXgUzBkd/Yb3ICSSQ9I6Q+kVzroP2VGTBwYxk/zGJ3zZkFptAa0hESF+CqfitSM3XHrsfnDTBePuEcvq8nAkMkYMOEk0wKX1pPNsbsqJPng/ENA269gkH/LAcSDiYjsEn8WuExg5A3T9pqn6aefAm97VZOU9FXN1tEj9HqDd5fwlA6eVmQyFpE5AO7Ujm9fbJs8HrXLzLjWQxpjyU6qtVzGK5Wp3XKeeETJMhlIxn2foKxnJ9zSNhZK9DhsGnwCGzlOeL47mRsiZhijB347UFfvYvJkJRUJOwwwm/mnngq3o/LCvabr0R0jUnCZUD3u+t+nhhuh9wSl4BpI9A0rmnfTP+H3tBubRZKHwCAAAAAElFTkSuQmCC
//
// @run-at      document-end
// @noframes
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       GM_notification
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_setClipboard
//
// @resource    iziToastCSS https://cdn.jsdelivr.net/npm/izitoast/dist/css/iziToast.css
// @require     https://cdn.jsdelivr.net/gh/mathiasbynens/utf8.js/utf8.js
// @require     https://cdn.jsdelivr.net/npm/izitoast/dist/js/iziToast.js
// @require     https://cdn.jsdelivr.net/gh/mitchellmebane/GM_fetch@master/GM_fetch.js
//
// @include     *
// @connect     *
// ==/UserScript==
