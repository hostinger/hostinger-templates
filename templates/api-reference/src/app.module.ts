import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { ContentService } from './content.service.js';
import { NotFoundViewFilter } from './not-found.filter.js';

@Module({
  controllers: [AppController],
  providers: [
    ContentService,
    {
      provide: APP_FILTER,
      useClass: NotFoundViewFilter,
    },
  ],
})
export class AppModule {}
