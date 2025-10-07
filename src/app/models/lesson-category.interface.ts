export interface LessonCategory {
  id?: string;
  Cate_Name: string;
  Color: string;
  Description: string;
  Icon: string;
  Ordering: number;
  Parent_Id: string | null;
}

export interface CategoryTree extends LessonCategory {
  children?: CategoryTree[];
}
