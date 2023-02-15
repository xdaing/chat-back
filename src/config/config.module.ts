import { DynamicModule } from '@nestjs/common'
import { ConfigModule as Config } from '@nestjs/config'

export const ConfigModule: DynamicModule = Config.forRoot()