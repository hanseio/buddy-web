document.addEventListener('DOMContentLoaded', function() {
    const mainText = document.querySelector('.main-text');
    const googleButton = document.querySelector('.google-login-button');
    const kakaoButton = document.querySelector('.kakao-login-button');
    const logo = document.querySelector('.logo');
    const phoneScreen = document.querySelector('.phone-screen');
    const chatBubbles = document.querySelectorAll('.chat-bubble');

    

    // 공통 애니메이션 함수 (애니메이션으로 요소 등장)
    function animateElement(element, delay = 0) {
        console.log('Animating:', element);  // 애니메이션 대상 확인
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }, delay);
    }

    // 순차적으로 애니메이션 적용
    setTimeout(() => {
        animateElement(mainText, 0);  // 메인 텍스트 등장
    }, 500);

    setTimeout(() => {
        animateElement(logo, 0);  // 로고 등장
        animateElement(googleButton, 0);  // 구글 로그인 버튼 등장
        animateElement(kakaoButton, 0);  // 카카오 로그인 버튼 등장
    }, 1000);

    setTimeout(() => {
        animateElement(phoneScreen, 0);  // 폰 스크린 등장
    }, 1500);

    // 채팅 말풍선 등장 (순차적으로 왼쪽/오른쪽 배치)
    chatBubbles.forEach((bubble, index) => {
        // 홀수 번째 말풍선은 왼쪽에 배치
        if ((index + 1) % 2 !== 0) {
            bubble.style.alignSelf = 'flex-start'; // 왼쪽 정렬
        }
        // 짝수 번째 말풍선은 오른쪽에 배치
        else {
            bubble.style.alignSelf = 'flex-end'; // 오른쪽 정렬
        }

        // 말풍선 등장 애니메이션 (폰 스크린 등장 이후 4.5초 후부터 실행)
        setTimeout(() => {
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
        }, 1800 + index * 250); // 말풍선이 순차적으로 1.5초 간격으로 나타남
    });
});