# claude-code-discord (ccd)

Claude Code를 Discord로 노출하는 봇. `zebbern/claude-code-discord`의 private fork (`origin: seoyeon6174/claude-code-discord`). Deno + TypeScript. 메타·운영 결정 기록은 `seoyeon6174/discord-config` 레포 참조.

## ⚠️ 이 레포는 실행 중인 서비스다

launchd `com.zebbern.ccd`가 **이 디렉토리를 WorkingDirectory로 24/7 실행 중** (KeepAlive). 코드를 수정해도 재시작 전까지 반영되지 않고, 잘못 수정하면 봇이 죽는다.

- 실행 명령: `deno task start` (= `deno run --allow-all index.ts`)
- 로그: `~/Library/Logs/ccd.log` · `~/Library/Logs/ccd.err` (+ 레포 루트 `bot.log`)
- 재시작: `launchctl kickstart -k gui/$(id -u)/com.zebbern.ccd`
- 중지/시작: `launchctl stop com.zebbern.ccd` / `launchctl start com.zebbern.ccd`

## 핵심 패치 (fork 이유)

`claude/client.ts:259` — `settingSources: ['user', 'project', 'local']`. 글로벌 자산(`~/.claude/CLAUDE.md`·skills·hooks)을 SDK 세션에 로드해 Mac Mini Claude Code CLI와 동등한 경험을 Discord로 제공. upstream 동기화 시 이 패치 보존 필수.

## 주의

- `.env`(Discord bot token 등)는 gitignore — 워크트리 작업 시 복사 필요
- Hermes 봇(다다·카카, `ai.hermes.gateway*`)과 **별개로 병행 운영** — 서로 무관
- 변경 후 `deno task check` + 봇 재시작 + `~/Library/Logs/ccd.err` 확인까지가 완료 기준
