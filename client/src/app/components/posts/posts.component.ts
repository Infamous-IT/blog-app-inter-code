import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Post } from 'src/app/interface/post.interface';
import { PostService } from '../../service/post.service';
import { FilterService } from '../../service/filter.service';
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {
  filteredPosts: Post[] = [];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  titleControl = new FormControl();
  descriptionControl = new FormControl();
  searchSubscription: Subscription;
  showScrollToTopButton = false;
  sortOrder: string = 'asc';

  // for paginator
  pageNumber: number = 1;
  pageSize: number = 6;
  totalItems: number = 0;


  constructor(
    private postService: PostService,
    private filterService: FilterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.searchSubscription = this.titleControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.performSearch('title', value);
      });

    this.descriptionControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.performSearch('description', value);
      });

    this.route.queryParamMap
      .pipe(
        switchMap((params) => {
          const category = params.get('category');
          return this.getPostsByCategory(category);
        })
      )
      .subscribe((posts) => {
        this.filteredPosts = posts;
      });

    this.range.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.performDateRangeSearch();
      });

    this.filterService.filterReset.subscribe(() => {
      this.resetFilter();
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  // getPostsByCategory(category: string) {
  //   const query = { category };
  //   return this.postService.filterPosts(query);
  // }

  // for paginator
  getPostsByCategory(category: string) {
    const query = {
      category,
      page: this.pageNumber.toString(),
      perPage: this.pageSize.toString()
    };

    return this.postService.filterPosts(query);
  }

  getPhotoSrc(photo: any): string {
    return this.postService.getPhotoSrc(photo);
  }

  viewDetails(post: any) {
    const postId = post['_id'];
    this.router.navigate(['post', postId]);
  }

  // performSearch(searchBy: 'title' | 'description', value: string) {
  //   const query: any = {};
  //
  //   if (searchBy === 'title') {
  //     query.title = value;
  //   } else if (searchBy === 'description') {
  //     query.description = value;
  //   }
  //
  //   if (value.trim() === '') {
  //     this.getPostsByCategory(null).subscribe(
  //       (posts) => {
  //         this.handleSearchResults(posts);
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     );
  //   } else {
  //     this.postService.filterPosts(query).subscribe(
  //       (posts) => {
  //         this.handleSearchResults(posts);
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     );
  //   }
  // }

  // For paginator
  performSearch(searchBy: 'title' | 'description', value: string) {
    const query: any = {};

    if (searchBy === 'title') {
      query.title = value;
    } else if (searchBy === 'description') {
      query.description = value;
    }

    if (value.trim() === '') {
      this.getPostsByCategory(null).subscribe(
        (posts) => {
          this.handleSearchResults(posts);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.postService.filterPosts({ ...query, page: this.pageNumber.toString(), perPage: this.pageSize.toString() }).subscribe(
        (posts) => {
          this.handleSearchResults(posts);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  // performDateRangeSearch() {
  //   const startDate = this.range.get('start').value;
  //   const endDate = this.range.get('end').value;
  //
  //   if (startDate && endDate) {
  //     const query: any = {};
  //
  //     query.startDate = startDate.toISOString();
  //     query.endDate = endDate.toISOString();
  //
  //     this.postService.filterPosts(query).subscribe(
  //       (posts) => {
  //         this.handleSearchResults(posts);
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     );
  //   }
  // }

  // For paginator
  performDateRangeSearch() {
    const startDate = this.range.get('start').value;
    const endDate = this.range.get('end').value;

    if (startDate && endDate) {
      const query: any = {};

      query.startDate = startDate.toISOString();
      query.endDate = endDate.toISOString();

      this.postService.filterPosts({ ...query, page: this.pageNumber.toString(), perPage: this.pageSize.toString() }).subscribe(
        (posts) => {
          this.handleSearchResults(posts);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  // handleSearchResults(posts: Post[]) {
  //   this.filteredPosts = posts;
  //   this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParamsHandling: 'merge',
  //     queryParams: { category: null },
  //   });
  // }

  //For paginator
  handleSearchResults(posts: Post[]) {
    this.filteredPosts = posts;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: { category: null },
    });

    this.totalItems = posts.length;
    this.pageNumber = 1;

    const maxPageNumber = Math.ceil(this.totalItems / this.pageSize);
    if (this.pageNumber > maxPageNumber) {
      this.pageNumber = maxPageNumber;
    }
  }

  // For paginator
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getPostsByCategory(null).subscribe(
      (posts) => {
        this.handleSearchResults(posts);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  resetFilter() {
    this.titleControl.setValue('');
    this.descriptionControl.setValue('');
    this.range.reset();
    this.filteredPosts = [];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: { category: null },
    });

    this.performSearch('title', '');
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const yOffset = window.pageYOffset;
    const threshold = 500;
    this.showScrollToTopButton = yOffset > threshold;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  sortPostsByCreationDate() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

    const query: any = {
      sortOrder: this.sortOrder
    };

    this.postService.filterPosts(query).subscribe(
      (posts: Post[]) => {
        this.filteredPosts = posts;
      },
      (error: any) => {
        console.error('An error occurred while filtering posts:', error);
      }
    );
  }
}
