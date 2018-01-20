function guidHelper() {
}

guidHelper.prototype.newguid = function () {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
}

guidHelper.prototype.s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
}

module.exports = function () {
    return guidHelper;
};