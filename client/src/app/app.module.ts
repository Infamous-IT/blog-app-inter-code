import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PostsComponent } from './components/posts/posts.component';
import { MenuComponent } from './components/menu/menu.component';
import { PostDetailsComponent } from './components/post-detail/post-details.component';
import { CreateComponent } from './components/create/create.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostService } from './service/post.service';

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    MenuComponent,
    PostDetailsComponent,
    CreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
