import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Post } from 'src/app/interface/post.interface';
import { PostService } from '../../service/post.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  searchTitle: FormControl;
  searchDescription: FormControl;
  searchCategory: FormControl;
  posts: Post[] = [];

  constructor(
    private postService: PostService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildFormControls();
    this.setupSearchObservables();
  }

  buildFormControls(): void {
    this.searchTitle = new FormControl('');
    this.searchDescription = new FormControl('');
    this.searchCategory = new FormControl('');
  }

  createNewPost(): void {
    this.router.navigate(['/posts/create']);
  }

  setupSearchObservables(): void {
    combineLatest([
      this.searchTitle.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
      this.searchDescription.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
      this.searchCategory.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
    ])
      .pipe(
        switchMap(([title, description, category]) =>
          this.searchPosts(title, description, category)
        )
      )
      .subscribe(
        (posts: Post[]) => {
          this.posts = posts;
          this.changeDetectorRef.detectChanges();
        },
        (error) => {
          console.error('Error fetching posts:', error);
        }
      );
  }

  searchPosts(title?: string, description?: string, category?: string): any {
    const query = {
      title: title || this.searchTitle.value,
      description: description || this.searchDescription.value,
      category: category || this.searchCategory.value
    };
    
    return this.postService.searchPosts(query);;
  }
}
