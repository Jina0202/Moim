# M O I M

## **1. 개발 인원**

- KAIST 18학번 김성혁
- KAIST 22학번 김지나

## **2. 개발 환경**

Client)

- Android, API level 33 (Snow Cone)
- Kotlin

Server)

- 서버 : node.js
- DB : MySQL

## **3. 앱 소개**

원하는 모임(팟)을 개설할 수 있는 앱입니다. 가능한 모임은 택시팟, 밥약팟, 야식팟, 공부/프로젝트 팟, 나만의 팟으로 구성되어 있으며, 나만의 팟의 경우, 원하는 종류의 팟을 개설할 수 있습니다.

### **1) 앱 구조**

- 로그인 / 회원가입

<img src="https://user-images.githubusercontent.com/80519883/202411962-5b067daf-6f86-4864-9171-5a19293234ff.png" width="30%" height="30%">  <img src="https://user-images.githubusercontent.com/80519883/202413588-9d929bcd-54fd-4161-9868-a2eee5da201a.png" width="30%" height="30%">

- Main 화면
    - 택시팟, 밥약팟, 야식팟, 공부/프로젝트 팟, 나만의 팟 중에 원하는 팟을 선택하여 들어갈 수 있습니다.
    - 탭은 홈 화면, 좋아요 누른 팟, 활동 중인 팟으로 구성되어 있습니다.
- 팟
    - 각 팟은 각각 class를 사용하였으며, 각 class는 공통된 요소를 포함하는 공통 class와 해당 팟의 고유한 특성을 담는 추가 class로 구성되어 있습니다.
        
        공통 class로는 팟의 고유 id, 팟의 이름, 현재 장소, 현재 인원수, 최대 인원수, 그리고 구체적인 설명이 들어있습니다.  
    - 팟 생성하기 버튼을 클릭하면 자신이 방장으로 설정되며, 팟의 구체적인 정보를 입력하여 팟을 생성할 수 있습니다. 해당 팟의 목록에 생성된 팟이 뜨며, 다른 사용자가 참여할 수 있습니다.
    - 참여한 사용자들은 채팅방에 입장할 수 있으며, 우측 상단 버튼을 통해 팟 나가기도 가능합니다.
    - 방장은 팟 정보 수정을 할 수 있습니다.
    - 각 사용자들은 좋아요를 눌러, 관심 팟을 저장할 수 있습니다.
- 택시팟
    - 택시팟의 추가 class에는 출발 지점, 도착 지점, 날짜와 시간이 있습니다.
- 밥약팟, 야식팟
    - 밥약팟, 야식팟의 추가 class에는 음식 종류와 출발 위치가 있습니다.
- 공부/프로젝트 팟, 나만의 팟
    - 공부/프로젝트/나만의 팟은 추가 class가 없습니다.

<img src="https://user-images.githubusercontent.com/80519883/202414558-c85771b7-7f97-420f-aa9e-c88931363422.png" width="30%" height="30%"> <img src="https://user-images.githubusercontent.com/80519883/202412040-63fc6cb1-9a25-48f3-a539-b674919ca3d5.png" width="30%" height="30%"> <img src="https://user-images.githubusercontent.com/80519883/202413954-843b5a82-6c6a-42c9-8341-6693441167c9.png" width="30%" height="30%">
