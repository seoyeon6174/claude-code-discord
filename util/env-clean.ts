/**
 * env-clean: 자식 claude CLI에 넘기는 env에서 부모 Claude Code 흔적을 제거.
 *
 * 봇이 Claude Code CLI 컨텍스트 안에서 띄워지면 (예: `claude` 명령으로 직접 실행)
 * `CLAUDECODE`, `CLAUDE_CODE_ENTRYPOINT`가 set되어 있다. 자식 claude CLI는 이를
 * "이미 Claude Code 세션 안" 표지로 보고 nested-session check로 exit 1.
 * 자식엔 이 표지를 빼고 깨끗한 새 세션으로 시작시킴.
 */
export function stripClaudeCodeMarkers(env: Record<string, string>): void {
  delete env.CLAUDECODE;
  delete env.CLAUDE_CODE_ENTRYPOINT;
}
