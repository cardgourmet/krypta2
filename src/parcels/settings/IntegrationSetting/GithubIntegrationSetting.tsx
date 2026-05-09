/*export function GithubIntegrationSetting() {
  return <GithubIntegration />;
}

function GithubIntegration() {
  const { initiateGitHubLogin, isLoading } = useGitHubLogin({
    clientId: '',

    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.log('error during oauth flow', err);
    },
    scope: 'read:user user:email',
  });

  return (
    <Button
      onClick={() => {
        initiateGitHubLogin();
      }}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Connect with GitHub'}
    </Button>
  );
}*/
