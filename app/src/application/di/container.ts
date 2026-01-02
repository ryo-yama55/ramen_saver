/**
 * 依存性注入（DI）コンテナ
 *
 * リポジトリの実装を切り替える際は、このファイルのみ変更すればOK
 * 他のコード（hooks、components等）は一切変更不要
 */

import type { ISavingsRecordRepository } from '@/domain/repositories/ISavingsRecordRepository'
import type { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository'
import { LocalStorageSavingsRecordRepository } from '@/infrastructure/localStorage/LocalStorageSavingsRecordRepository'
import { LocalStorageUserProfileRepository } from '@/infrastructure/localStorage/LocalStorageUserProfileRepository'
import { GetTotalSavingsUseCase } from '@/application/usecases/GetTotalSavingsUseCase'
import { GetMonthlySavingsUseCase } from '@/application/usecases/GetMonthlySavingsUseCase'
import { SaveRamenResistanceUseCase } from '@/application/usecases/SaveRamenResistanceUseCase'
import { InitializeUserProfileUseCase } from '@/application/usecases/InitializeUserProfileUseCase'
import { GetSavingsHistoryUseCase } from '@/application/usecases/GetSavingsHistoryUseCase'
import { GetUserProfileUseCase } from '@/application/usecases/GetUserProfileUseCase'
import { UpdateRamenPriceUseCase } from '@/application/usecases/UpdateRamenPriceUseCase'

// ============================================================
// Phase 1-2: LocalStorage実装を使用
// ============================================================

export const savingsRecordRepository: ISavingsRecordRepository =
  new LocalStorageSavingsRecordRepository()

export const userProfileRepository: IUserProfileRepository = new LocalStorageUserProfileRepository()

// ============================================================
// UseCases
// ============================================================

export const getTotalSavingsUseCase = new GetTotalSavingsUseCase(savingsRecordRepository)

export const getMonthlySavingsUseCase = new GetMonthlySavingsUseCase(savingsRecordRepository)

export const saveRamenResistanceUseCase = new SaveRamenResistanceUseCase(
  savingsRecordRepository,
  userProfileRepository
)

export const initializeUserProfileUseCase = new InitializeUserProfileUseCase(userProfileRepository)

export const getSavingsHistoryUseCase = new GetSavingsHistoryUseCase(savingsRecordRepository)

export const getUserProfileUseCase = new GetUserProfileUseCase(userProfileRepository)

export const updateRamenPriceUseCase = new UpdateRamenPriceUseCase(userProfileRepository)

// ============================================================
// Phase 3: Supabase実装に切り替える場合
// ============================================================
//
// import { SupabaseSavingsRecordRepository } from '@/infrastructure/supabase/SupabaseSavingsRecordRepository'
// import { SupabaseUserProfileRepository } from '@/infrastructure/supabase/SupabaseUserProfileRepository'
//
// export const savingsRecordRepository: ISavingsRecordRepository =
//   new SupabaseSavingsRecordRepository()
//
// export const userProfileRepository: IUserProfileRepository =
//   new SupabaseUserProfileRepository()
