import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from 'src/utils/intercepter/response.intercepter';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { LeaguesModule } from 'src/modules/leagues/leagues.module';
import { TeamsModule } from 'src/modules/teams/teams.module';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CategoriesEventModule } from 'src/modules/categories-event/categories-event.module';
import { DataSource } from 'typeorm';
import AdminSeeder from 'src/database/seeder/admin.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...databaseConfig(configService),
      }),
    }),
    CategoriesModule,
    LeaguesModule,
    TeamsModule,
    UserModule,
    AuthModule,
    CategoriesEventModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      const adminSeeder = new AdminSeeder();
      await adminSeeder.run(this.dataSource);
    } catch (error) {
      this.logger.error('Error executing seeders during module initialization:', error);
    }
  }
}
