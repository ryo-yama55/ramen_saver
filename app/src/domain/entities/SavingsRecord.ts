/**
 * 貯金記録エンティティ
 *
 * ラーメンを我慢して節約した記録を表すドメインエンティティ
 */

/**
 * 貯金記録
 */
export type SavingsRecord = {
  /** 記録ID（UUID） */
  id: string

  /** 節約額（その時点のラーメン価格） */
  amount: number

  /** 記録日時 */
  recordedAt: Date

  /** 論理削除フラグ */
  isDeleted: boolean
}

/**
 * 貯金記録作成時の入力
 */
export type CreateSavingsRecordInput = {
  /** 節約額 */
  amount: number
}

/**
 * 貯金記録のフィルタ条件
 */
export type SavingsRecordFilters = {
  /** 開始日時（この日時以降の記録を取得） */
  startDate?: Date

  /** 終了日時（この日時以前の記録を取得） */
  endDate?: Date

  /** 取得件数の上限 */
  limit?: number

  /** スキップする件数（ページング用） */
  offset?: number
}
