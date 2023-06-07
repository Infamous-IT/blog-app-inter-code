import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';


import { AppComponent } from './app.component';
import { PostsComponent } from './components/posts/posts.component';
import { MenuComponent } from './components/menu/menu.component';
import { PostDetailsComponent } from './components/post-detail/post-details.component';
import { CreateComponent } from './components/create/create.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostService } from './service/post.service';
import { DragAndDropDirective } from './directive/drag-and-drop.directive';
import { ProgressComponent } from './components/progress/progress.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { FooterComponent } from './components/footer/footer.component';
import { FilterComponent } from './components/filter/filter.component';

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    MenuComponent,
    PostDetailsComponent,
    CreateComponent,
    DragAndDropDirective,
    ProgressComponent,
    CommentListComponent,
    FooterComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    DragDropModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSnackBarModule,
    MatPaginatorModule
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
