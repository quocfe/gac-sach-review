import { normalizeSearch } from '@/modules/domain';
export type Edition = { id:string; isbn:string; publisher:string; year:number; language:string; translator?:string };
export type Book = { id:string; slug:string; title:string; author:string; authorSlug:string; genres:string[]; year:number; language:string; rating:number; ratingCount:number; reviews:number; blurb:string; editions:Edition[]; tone:string; featured?:boolean };
const base = [
 ['de-men-phieu-luu-ky','Dế Mèn Phiêu Lưu Ký','Tô Hoài','to-hoai','Văn học Việt Nam',1941,'Một cuộc du hành đầy hồn nhiên, kiêu hãnh và những bài học đầu đời.'],
 ['mat-biec','Mắt Biếc','Nguyễn Nhật Ánh','nguyen-nhat-anh','Văn học Việt Nam',1990,'Tuổi trẻ, tình yêu đơn phương và một miền ký ức xanh không phai.'],
 ['noi-buon-chien-tranh','Nỗi Buồn Chiến Tranh','Bảo Ninh','bao-ninh','Văn học Việt Nam',1990,'Một cái nhìn ám ảnh, nhân bản về ký ức chiến tranh.'],
 ['kieu','Truyện Kiều','Nguyễn Du','nguyen-du','Kinh điển',1820,'Số phận, tài hoa và lòng trắc ẩn trong kiệt tác thi ca.'],
 ['dune','Dune','Frank Herbert','frank-herbert','Khoa học viễn tưởng',1965,'Quyền lực, sinh thái và lời tiên tri trên hành tinh cát.'],
 ['ke-giet-chim-nhai','Giết Con Chim Nhại','Harper Lee','harper-lee','Kinh điển',1960,'Công lý được nhìn qua đôi mắt trẻ thơ ở miền Nam nước Mỹ.'],
 ['rung-na-uy','Rừng Na Uy','Haruki Murakami','haruki-murakami','Văn học dịch',1987,'Sự mong manh của tuổi trẻ, mất mát và âm nhạc.'],
 ['1984','1984','George Orwell','george-orwell','Khoa học viễn tưởng',1949,'Lời cảnh báo lạnh lẽo về giám sát và sự thật bị thao túng.'],
 ['nha-gia-kim','Nhà Giả Kim','Paulo Coelho','paulo-coelho','Phát triển bản thân',1988,'Một ngụ ngôn nhẹ nhàng về hành trình đi tìm kho báu.'],
 ['tu-duy-nhanh-va-cham','Tư Duy Nhanh Và Chậm','Daniel Kahneman','daniel-kahneman','Tâm lý học',2011,'Hai hệ thống tư duy định hình mọi phán đoán thường ngày.'],
 ['sapiens','Sapiens','Yuval Noah Harari','yuval-noah-harari','Lịch sử',2011,'Lịch sử cô đọng và táo bạo về loài người.'],
 ['nguoi-dua-dieu','Người Đua Diều','Khaled Hosseini','khaled-hosseini','Văn học dịch',2003,'Tình bạn, mặc cảm và con đường chuộc lỗi ở Kabul.'],
 ['pachinko','Pachinko','Min Jin Lee','min-jin-lee','Văn học dịch',2017,'Bốn thế hệ một gia đình Hàn Quốc tại Nhật Bản.'],
 ['education','Giáo Dục','Tara Westover','tara-westover','Hồi ký',2018,'Học tập như một cách gọi tên và tự kiến tạo đời mình.'],
 ['atomic-habits','Thay Đổi Tí Hon, Hiệu Quả Bất Ngờ','James Clear','james-clear','Phát triển bản thân',2018,'Những hệ thống nhỏ có thể tạo nên thay đổi bền vững.'],
 ['thinking','Tư Duy Mở','Carol Dweck','carol-dweck','Tâm lý học',2006,'Niềm tin về năng lực ảnh hưởng tới cách ta học hỏi.'],
 ['brief-history','Lược Sử Thời Gian','Stephen Hawking','stephen-hawking','Khoa học viễn tưởng',1988,'Một cửa ngõ sáng rõ vào vũ trụ học hiện đại.'],
 ['dong-song','Đồng Sông','Nguyễn Ngọc Tư','nguyen-ngoc-tu','Văn học Việt Nam',2010,'Những phận người và dòng nước chảy qua miền Tây.'],
 ['nghin-le-mot','Nghìn Lẻ Một Đêm','Antoine Galland','antoine-galland','Kinh điển',1704,'Những câu chuyện nối tiếp để trì hoãn định mệnh.'],
 ['silicon','Những Kẻ Xuất Chúng','Malcolm Gladwell','malcolm-gladwell','Tâm lý học',2008,'Thành công, bối cảnh và mười nghìn giờ luyện tập.'],
] as const;
export const books:Book[] = base.map((x,i)=>({id:`w${i+1}`,slug:x[0],title:x[1],author:x[2],authorSlug:x[3],genres:[x[4]],year:x[5],language:i%3===0?'Tiếng Việt':'Bản dịch tiếng Việt',rating:Number((3.9+(i%10)/10).toFixed(1)),ratingCount:24+i*17,reviews:4+i,blurb:x[6],tone:['ochre','sage','plum','blue'][i%4],featured:i<4,editions:[{id:`e${i+1}a`,isbn:`978-604-${String(100000+i).padStart(6,'0')}`,publisher:'Nhà xuất bản Bản Đồ',year:x[5],language:'Tiếng Việt'},{id:`e${i+1}b`,isbn:`978-0-00-${String(200000+i).padStart(6,'0')}`,publisher:'Ấn bản quốc tế',year:x[5]+10,language:'English'}]}));
export const genres=[...new Set(books.flatMap(b=>b.genres))];
export const bySlug=(slug:string)=>books.find(b=>b.slug===slug);
export function searchBooks(q='', genre='', minRating=0){const needle=normalizeSearch(q);return books.filter(b=>(!needle||normalizeSearch(`${b.title} ${b.author} ${b.editions.map(e=>e.isbn).join(' ')}`).includes(needle))&&(!genre||b.genres.includes(genre))&&b.rating>=minRating)}
