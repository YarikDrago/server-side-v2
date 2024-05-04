// data transfer object
module.exports = class UserDto {
    email;
    nickname;
    id;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this.nickname = model.nickname;
        this.id = model._id; // нижнее подчеркивание для обозначения что поле не изменяемое
        this.isActivated = model.isActivated;
    }
}
