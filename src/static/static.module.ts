import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

export const StaticModule = ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../public')
})