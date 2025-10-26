import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

const metadata = {
  title: 'CanThoTravel',
  description:
    'CanThoTravel - Kênh thông tin du lịch Cần Thơ, điểm đến hấp dẫn với nhiều trải nghiệm văn hóa, ẩm thực và thiên nhiên tuyệt vời.',
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />

      <HomeView />
    </>
  );
}
