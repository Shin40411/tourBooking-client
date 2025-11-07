import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { UserEditView } from 'src/sections/user/view';
import { fetchUserInfo } from 'src/actions/user';
import { useEffect, useState } from 'react';
import { UserItem } from 'src/types/user';

// ----------------------------------------------------------------------

const metadata = { title: `Chỉnh sửa tài khoản người dùng | Quản lý - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  const [currentUser, setCurrentUser] = useState<UserItem>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchUserInfo(Number(id));
        setCurrentUser(user);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error);
      }
    };

    if (id) fetchUser();
  }, [id]);

  return (
    <>
      <title>{metadata.title}</title>

      <UserEditView user={currentUser} />
    </>
  );
}
