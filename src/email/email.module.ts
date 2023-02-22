import { Module } from '@nestjs/common'
import { DbModule } from '@/db/db.module'
import { MailerModule as Mailer } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { ConfigModule } from '@/config/config.module'
import { EmailService } from './email.service'

const MailerModule = Mailer.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: 'smtp.126.com',
      port: 465,
      auth: {
        user: configService.get('EmailUser'),
        pass: configService.get('EmailPass')
      }
    }
  })
})

@Module({
  imports: [DbModule, MailerModule, ConfigModule],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule { }
