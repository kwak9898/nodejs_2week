const { sign } = require("./validation");

test('닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 이루어져 있어야 합니다.', () => {
    expect(sign("as1", "1234", "1234")).toEqual(true); // 닉네임 3자 이상
    expect(sign("as123", "1234", "1234")).toEqual(true); // 닉네임 3자 이상
    expect(sign("a1", "1234", "1234")).toEqual(false); // 닉네임 3자 미만
});

test("비밀번호는 최소 4자 이상입니다.", () => {
    expect(sign("as1", "1234", "1234")).toEqual(true); // 비밀번호 4자 이상
    expect(sign("as123", "1234", "1234")).toEqual(true); // 비밀번호 4자 이상
    expect(sign("a1123", "123", "123")).toEqual(false); // 비밀번호 4자 미만
});

test("비밀번호가 닉네임과 같은 값이 포함된 경우 회원가입에 실패합니다.", () => {
    expect(sign("as1", "1234", "1234")).toEqual(true); // 같은 값이 포함되지 않은 비밀번호
    expect(sign("as123", "1234", "1234")).toEqual(true); // 같은 값이 포함되지 않은 비밀번호
    expect(sign("a1234", "a1234", "a1234")).toEqual(false); // 같은 값이 포함된 비밀번호
});

test("비밀번호 확인은 비밀번호와 정확하게 일치해야 합니다.", () => {
    expect(sign("as1", "1234", "1234")).toEqual(true); // 일치하는 비밀번호
    expect(sign("as123", "1234", "1234")).toEqual(true); // 일치하는 비밀번호
    expect(sign("a1234", "a12345", "a123")).toEqual(false); // 일치하지 않은 비밀번호
});

test("데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른 경우 '중복된 닉네임입니다.' 라는 에러메세지가 발생합니다.", () => {
    expect(sign("asd1234", "1234", "1234")).toEqual(true); //테스트용 닉네임
    expect(sign("as123", "1234", "1234")).toEqual(true);  //테스트용 닉네임
    expect(sign("asd123", "a12345", "a123")).toEqual(false); // 중복된 닉네임
});