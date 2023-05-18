import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostsComponent } from './components/posts/posts.component';
import { CreateComponent } from './components/create/create.component';
import { PostDetailsComponent } from './components/post-detail/post-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: PostsComponent },
  { path: 'posts/create', component: CreateComponent},
  { path: 'post/:id', component: PostDetailsComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
