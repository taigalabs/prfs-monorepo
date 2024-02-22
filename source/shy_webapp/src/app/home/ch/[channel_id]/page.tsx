import React, { Suspense } from "react";

import styles from "./ChannelPage.module.scss";
import DefaultLayout, { DefaultMain } from "@/components/layouts/default_layout/DefaultLayout";
import CreatePostForm from "@/components/create_post_form/CreatePostForm";
import GlobalHeader from "@/components/global_header/GlobalHeader";
import Board from "@/components/board/Board";

const ChannelPage: React.FC<ChannelPageProps> = ({ params }) => {
  // const i18n = React.useContext(i18nContext);
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const dispatch = useDispatch();

  // const localPrfsAccount = useAppSelector(state => state.user.shyCredential);
  // useLocalWallet(dispatch);

  // React.useEffect(() => {
  //   if (localPrfsAccount === null) {
  //     router.push(`${paths.sign_in}`);
  //   }
  // }, [router]);

  // const isPostPage = searchParams.get("post") !== null;

  return (
    <DefaultLayout>
      <Suspense>
        {/* <GlobalHeader /> */}
        <DefaultMain>
          <Board />
        </DefaultMain>
      </Suspense>
    </DefaultLayout>
  );
};

export default ChannelPage;

export interface ChannelPageProps {
  params: {
    channel_id: string;
  };
}
