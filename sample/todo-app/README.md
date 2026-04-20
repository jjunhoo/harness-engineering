# Todo 샘플 — 하네스 엔지니어링 적용

Spring Boot(Java) REST API + React(Vite) UI로 **할 일 관리**를 구현한 예시다. 루트의 하네스 문서(`AGENTS.md`, `docs/WORKFLOW.md`, `architecture/LAYERED_MODEL.md`)와 같은 **레이어 방향**을 따른다.

## 레이어 매핑 (Java)

| 하네스 레이어 | 이 프로젝트 패키지 |
|---------------|-------------------|
| Types | `domain/` (엔티티·도메인 규칙), `dto/` (API 경계 타입) |
| Config | `config/` (CORS 등) |
| Repo | `repository/` (Spring Data JPA) |
| Service | `service/` (유스케이스) |
| Runtime / UI | `web/` (REST 컨트롤러 = 외부 어댑터) |

React는 별도 `frontend/` 앱으로, **UI 표현층**에 해당한다. 백엔드 `web`은 JSON API만 제공한다.

## 실행

### Docker로 한 번에 (권장)

저장소 루트가 아니라 **이 디렉터리**에서:

```bash
cd sample/todo-app
docker compose up --build
```

- UI: **http://localhost:15173** (호스트 포트; 컨테이너 내부는 5173)
- API 직접: **http://localhost:18080/api/todos** (호스트 18080 → 컨테이너 8080)  
  중지: `Ctrl+C` 또는 `docker compose down`

> 로컬에 이미 8080/5173을 쓰는 프로세스가 있으면 `docker-compose.yml`의 포트 매핑을 바꿔도 됩니다.

### 로컬 개발 (Maven + Node)

### 백엔드 (포트 8080)

```bash
cd sample/todo-app/backend
mvn spring-boot:run
```

### 프론트 (포트 5173, Vite 프록시 → 8080)

```bash
cd sample/todo-app/frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` — API는 Vite 프록시로 `/api` → `http://localhost:8080`.

## 하네스 연동

- 계획: `../../plans/2026-04-20-sample-todo-app.md`
- 구조 스모크: 루트 `evaluations/scripts/check-layer-smoke.sh` (샘플 경로 포함)
- CI: `.github/workflows/sample-todo-ci.yml`
