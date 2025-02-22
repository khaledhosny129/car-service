import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema } from 'src/users/entities/users.entity';
import { DriverSchema } from 'src/driver/entities/driver.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver } from 'src/driver/entities/driver.entity';
import { User } from 'src/users/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { DriverModule } from 'src/driver/driver.module';
import { MailModule } from 'src/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MerchantModule } from 'src/merchant/merchant.module';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MailModule,
    DriverModule,
    MerchantModule,
  ],

  exports: [AuthService],
})
export class AuthModule {}
