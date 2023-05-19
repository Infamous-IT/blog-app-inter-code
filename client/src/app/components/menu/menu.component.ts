import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/interface/post.interface';
import { PostService } from '../../service/post.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  posts: Post[] = [];
  category: string;

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.category = params['category'] || null;
    });
  }


  filterPostsByCategory(category: string) {
    this.category = category;
    this.router.navigate([], { queryParams: { category: category } });
  }

  createNewPost(): void {
    this.router.navigate(['/posts/create']);
  }

  backToHomePage() {
    this.router.navigate(['/']);
  }
}
