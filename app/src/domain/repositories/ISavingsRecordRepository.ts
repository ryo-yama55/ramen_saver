/**
 * 貯金記録リポジトリインターフェース
 *
 * データアクセスの抽象化層
 * 実装はインフラ層で行う（LocalStorage、Supabase等）
 */

import type {
  SavingsRecord,
  CreateSavingsRecordInput,
  SavingsRecordFilters,
} from '../entities/SavingsRecord';

/**
 * 貯金記録リポジトリのインターフェース
 */
export interface ISavingsRecordRepository {
  /**
   * 記録を全件取得
   *
   * @param filters - フィルタ条件（オプショナル）
   * @returns 貯金記録の配列
   */
  findAll(filters?: SavingsRecordFilters): Promise<SavingsRecord[]>;

  /**
   * IDで記録を取得
   *
   * @param id - 記録ID
   * @returns 貯金記録（見つからない場合はnull）
   */
  findById(id: string): Promise<SavingsRecord | null>;

  /**
   * 新規記録を作成
   *
   * @param input - 作成する記録の情報
   * @returns 作成された貯金記録
   */
  create(input: CreateSavingsRecordInput): Promise<SavingsRecord>;

  /**
   * 記録を削除（論理削除）
   *
   * @param id - 削除する記録のID
   */
  delete(id: string): Promise<void>;

  /**
   * 総貯金額を計算
   *
   * @returns 累計貯金額
   */
  getTotalSavings(): Promise<number>;

  /**
   * 今月の貯金額を計算
   *
   * @param year - 年
   * @param month - 月（1-12）
   * @returns 指定月の貯金額
   */
  getMonthlySavings(year: number, month: number): Promise<number>;

  /**
   * 累計貯金回数を取得
   *
   * @returns 貯金した回数
   */
  getTotalCount(): Promise<number>;
}
