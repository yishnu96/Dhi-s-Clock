import path from 'node:path';
import { renderEvidenceSection, renderRecordGrid } from './media-sections.mjs';

const titles = {
  24923: 'Before an important call', 24924: 'Making room for study',
  24926: 'A daily moment to check in', 24927: 'Before leaving for work',
  24928: 'At the desk', 24929: 'Before heading out',
  24930: 'The clock and its creator', 24953: 'The face behind the idea',
  24954: 'World Book Fair 2025', 24955: 'The story of the logo',
  24956: 'From the recognition archive', 24958: 'At College Street Coffee House',
  24959: 'How the identity evolved', 24960: 'On display at Delhi airport',
  24976: 'Introducing the clock', 24977: 'A portrait on display',
  24978: 'At Solstice 2024', 24979: 'A conversation about personal time',
  24981: 'Zee Business', 24984: 'The clock’s public introduction',
  24985: 'The Quint', 24987: 'A thought from Dhi',
  24994: 'Republic World · September 2024', 24995: 'BW Businessworld · August 2024',
  24996: 'Dhi at the microphone', 24997: 'On stage at the reveal',
  24998: 'Sharing the idea', 24931: 'Literary recognition',
  24932: 'With the audience at Solstice', 24935: 'A moment from Solstice 2024',
  24937: 'The clock on stage', 24938: 'Kolkata Literary Carnival',
  24939: 'The writing on display', 24940: 'Oxford Bookstore · 2023',
  24941: 'BW Disrupt', 24942: 'A billboard in Manila',
  24943: 'The books reach the street', 24945: 'On finding her own way',
  24946: 'Advice from Dhi', 24947: 'TheCelebrity.Online',
  24948: 'An interview about what comes next', 24949: 'Introducing Saudamini',
  24950: 'Her perspective', 24951: 'From childhood to adulthood',
  24952: 'Beyond first impressions', 24961: 'A creative response to her books',
  24962: 'The author with her writing', 24968: 'At Kolkata’s Boi Chitra',
  24969: 'A conversation at Oxford Bookstore', 24970: 'A book discussion in Kolkata',
  24972: 'A billboard on EDSA', 24973: 'Her work in Manila',
  24974: 'India Today · August 2022', 24975: 'Zee Business', 24980: 'ABP Live',
  24934: 'The clock reveal · Film one', 24936: 'The clock reveal · Film two'
};

export function placeMedia(records, { youtube, books }) {
  const entries = records.map(entry => {
    const number = Number(path.basename(entry.source).split('.')[0]);
    return { ...entry, number, title: titles[number] || entry.title || entry.caption };
  });
  function select(numbers) {
    return numbers.map(number => {
      const entry = entries.find(item => item.number === number);
      if (!entry) throw new Error(`Missing reviewed media ${number}`);
      return entry;
    });
  }
  const press = select([24994,24995,24981,24985]);
  press[0].articleUrl = 'https://www.republicworld.com/initiatives/tete-a-tete-with-saudamini-mishra-aka-dhi-inventor-of-dhi-s-clock-people-s-digital-mentor-and-prot';
  press[1].articleUrl = 'https://www.businessworld.in/article/saudamini-mishra-aka-dhi-is-revolutionising-the-way-we-live-with-her-astounding-invention-dhis-clock-530392';
  press[2].articleUrl = 'https://www.zeebiz.com/agencies/big-bang-inventor-best-selling-author-and-top-rated-app-owner-saudamini-mishra-aka-dhi-launches-her-original-time-device-for-psychological-welfare-254157';
  press[3].articleUrl = 'https://www.thequint.com/brandstudio/partner-dhis-clock-saudamini-mishra';
  const authorPress = select([24974,24975,24980,24947,24940,24942,24931,24941,24949,24945,24946,24948,24950,24951,24952]);
  const urls = ['https://www.indiatoday.in/impact-feature/story/author-saudamini-mishra-releases-her-fifth-bestselling-book-dhi-s-law-of-nine-archetypes-of-dhi-s-transformation-series-1985264-2022-08-08','https://www.zeebiz.com/companies/news-saudamini-mishra-a-youth-icon-engages-people-with-her-exemplary-writing-aspires-to-refashion-peoples-outlook-180772','https://news.abplive.com/brand-wire/best-selling-author-owner-of-one-of-the-top-rated-educational-apps-saudamini-mishra-is-a-role-model-in-a-man-s-world-1586671','https://khyatigautam.wordpress.com/2020/11/08/author-interview-saudamini-mishra-dhis-parables-of-divine-transformation/'];
  urls.forEach((url,i)=>authorPress[i].articleUrl=url);
  authorPress.splice(5,0,{id:'frankfurt-certificate',kind:'image',src:'assets/recognition-1.webp',thumbnail:'assets/recognition-1-small.webp',width:640,height:800,alt:'Frankfurt Book Fair participation certificate',title:'Frankfurt Book Fair'});
  const authorBooks=select([24938,24970,24962,24961,24968,24969,24939,24943,24972,24973]);
  authorBooks.splice(1,0,{id:'new-delhi-event',kind:'image',src:'assets/client/launch-promo-story.webp',width:640,height:1138,alt:'New Delhi World Book Fair Meet the Author announcement',title:'New Delhi World Book Fair'});
  const archiveNote = 'From the Dhi’s Clock archive. Open an image to read the full clipping or see the original photograph.';
  return {
    clockPress: renderEvidenceSection({
      id: 'clock-coverage', title: 'The clock in the press.',
      intro: 'Interviews and features about Dhi’s Clock, collected in one place so you can explore the idea before you buy.',
      entries: press, variant: 'press', note: archiveNote
    }),
    clockReveal: renderEvidenceSection({
      id: 'clock-reveal', title: 'See the idea take the stage.',
      intro: 'Watch two short clips from the clock’s reveal at Solstice 2024, with photographs from the event and its public displays.',
      entries: select([24934,24936,24937,24976,24978,24979,24996,24997,24998,24932,24935,24960,24977,24984]),
      variant: 'events', separateVideos: true,
      cta: { href: youtube, label: 'Learn more about the clock on YouTube' }
    }),
    usagePictures: renderRecordGrid(select([24923,24924,24926,24927,24928,24929,24987]), 'usage'),
    milestonePictures: renderRecordGrid(select([24930,24954,24955,24956,24958,24959,24953]), 'milestones'),
    authorEvidence: renderEvidenceSection({
      id: 'author-press', title: 'Press and Recognition',
      intro: 'Read about Saudamini’s writing and perspective through these press clippings and interview excerpts.',
      entries: authorPress,
      moreLabel: 'Read more profiles and interview excerpts', note: archiveNote,
      cta: { href: books, label: 'Explore Saudamini’s books on Amazon' }
    }) + renderEvidenceSection({
      id: 'author-books', title: 'Book Fair & Literary Carnival',
      intro: 'From literary events to bookshop displays: a photographic record of Dhi’s writing reaching readers.',
      entries: authorBooks,
      leadCount: 1, moreLabel: 'View literary events, recognition and book displays',
      note: 'Photographs, event announcements and archive collages supplied by Dhi’s Clock.'
    })
  };
}

