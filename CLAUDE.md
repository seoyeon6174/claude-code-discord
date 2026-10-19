# claude-code-discord (ccd)

Claude Code를 Discord로 노출하는 봇. `zebbern/claude-code-discord`의 private fork (`origin: seoyeon6174/claude-code-discord`). Deno + TypeScript. 메타·운영 결정 기록은 `seoyeon6174/discord-config` 레포 참조.

## ⚠️ 이 레포는 실행 중인 서비스다

launchd `com.zebbern.ccd`가 **이 디렉토리를 WorkingDirectory로 24/7 실행 중** (KeepAlive). 코드를 수정해도 재시작 전까지 반영되지 않고, 잘못 수정하면 봇이 죽는다.

- 실행 명령: `deno task start` (= `deno run --allow-all index.ts`)
- 로그: `~/Library/Logs/ccd.log` · `~/Library/Logs/ccd.err` (레포 루트 `bot.log`는 legacy, 2026-05 이후 미갱신)
- 재시작: `launchctl kickstart -k gui/$(id -u)/com.zebbern.ccd`
- 중지/시작: `launchctl stop com.zebbern.ccd` / `launchctl start com.zebbern.ccd`

### plist 의 DNS 대기 래퍼 (재생성 시 유실 주의)

`~/Library/LaunchAgents/com.zebbern.ccd.plist` 의 `ProgramArguments` 는 `/bin/sh -c` 로 감싸져 있고, `nc -z discord.com 443` 이 뚫릴 때까지(최대 60초) 기다린 뒤 `exec /opt/homebrew/bin/deno task start` 한다.

부팅 직후 네트워크가 준비되기 전에 떠서 `dns error: failed to lookup address information` 으로 죽고 `KeepAlive` 가 재시도하는 동안 `ccd.err` 가 스택트레이스로 차던 것을 막는다. 같은 원인으로 `Failed to fetch models from Anthropic API: fetch failed` 도 같이 찍혔다 — 이건 API 키 문제가 아니라 같은 DNS 실패다(`model-fetcher.ts` 는 키가 없으면 로그 없이 `null` 을 반환하고, HTTP 오류는 `Anthropic Models API error: <status>` 로 따로 찍는다).

**이 plist 는 어떤 카탈로그에도 없어 배포본이 유일본이다.** 다시 만들면 래퍼가 조용히 사라진다. 기능은 래퍼 없이도 재시도로 자기복구하므로 손실은 부팅 로그 가독성뿐이다.


## 핵심 패치 (fork 이유)

`claude/client.ts:259` — `settingSources: ['user', 'project', 'local']`. 글로벌 자산(`~/.claude/CLAUDE.md`·skills·hooks)을 SDK 세션에 로드해 Mac Mini Claude Code CLI와 동등한 경험을 Discord로 제공. upstream 동기화 시 이 패치 보존 필수.

- upstream merge 후 `grep -n settingSources claude/client.ts`로 패치 생존 확인 (2026-08 기준 259행 부근, merge로 행 번호 이동 가능)

## 주의

- `.env`(Discord bot token 등)는 gitignore — 워크트리 작업 시 복사 필요
- Hermes 봇(다다·카카, `ai.hermes.gateway*`)과 **별개로 병행 운영** — 서로 무관
- 변경 후 `deno task check` + 봇 재시작 + `~/Library/Logs/ccd.err` 확인까지가 완료 기준
