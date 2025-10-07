import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { SubNavigationComponent } from './layout/sub-navigation/sub-navigation.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { MatTreeModule } from '@angular/material/tree';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot([
            { path: '', component: MainLayoutComponent }
        ]),
        AuthModule,
        AppComponent,
        MainLayoutComponent,
        NavigationComponent,
        SubNavigationComponent,
        HomeComponent,
        MatTreeModule
    ],
    providers: [
        AuthService,
        provideAuth(() => getAuth())
    ]
})
export class AppModule { }