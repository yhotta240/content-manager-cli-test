import * as readline from 'node:readline'

/**
 * yes/no 形式でユーザーに確認する
 * @param message ユーザーに表示する確認メッセージ（例: "上書きしますか？ (y/n)"）
 * @returns ユーザーが yes 系（y, yes）を入力したら true、そうでなければ false
 */
export async function confirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question(`${message} (y/n): `, (answer) => {
      rl.close()
      const normalized = answer.trim().toLowerCase()
      resolve(normalized === 'y' || normalized === 'yes')
    })
  })
}
