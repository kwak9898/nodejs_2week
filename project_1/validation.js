module.exports = {
    sign: (username, password, confirmPassword) => {
        const Users = "asd123" // 중복된 닉네임 찾기위해서 DB에 저장 되어있는 닉네임을 가져옴.

        if (!/^([a-zA-z0-9]).{2,}$/.test(username)) { // 정규식을 이용해서 테스트 진행
            return false;
        } else if (!/^([a-zA-z0-9]).{3,}$/.test(password)) { // 정규식을 이용해서 테스트 진행
            return false;
        } else if (username === password) { // username과 password가 일치하면 false
            return false;
        } else if (password !== confirmPassword) { // password와 confirmPassword가 일치하지않으면 false
            return false;
        } else if (username === Users) { // username과 User가 일치하면 false
            console.log("중복된 닉네임입니다.")
            return false;
        }

        return true;
    }
}