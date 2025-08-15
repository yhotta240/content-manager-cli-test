import type { PublishType } from "../types/gh-pages";

function getDeployJob(publishType: PublishType, buildDir: string, extRepo: string, tokenName: string, jekyll: boolean) {
  const deployJob: any = {
    'runs-on': 'ubuntu-latest',
  };

  if (jekyll) {
    deployJob.needs = 'build';
  }

  let steps: any[];

  switch (publishType) {
    case 'sameRepoMain':
      steps = [
        {
          name: 'Checkout',
          uses: 'actions/checkout@v4',
        },
        {
          name: 'Update artifact',
          uses: 'actions/upload-pages-artifact@v3',
          with: {
            path: buildDir,
          },
        },
        {
          name: 'Deploy content to GitHub Pages',
          id: 'deployment',
          uses: 'actions/deploy-pages@v4',
        },
      ];
      break;

    case 'sameRepoGhPages':
      steps = [
        {
          name: 'Deploy content to gh-pages',
          uses: 'peaceiris/actions-gh-pages@v3',
          with: {
            github_token: '${{ secrets.GITHUB_TOKEN }}',
            publish_branch: 'gh-pages',
            publish_dir: buildDir,
          },
        },
      ];
      break;

    case 'otherRepoMain':
    case 'otherRepoGhPages':
      steps = [
        {
          name: `Deploy content to another repository ${publishType === 'otherRepoMain' ? 'main' : 'gh-pages'}`,
          uses: 'peaceiris/actions-gh-pages@v3',
          with: {
            'personal-token': `\${{ secrets.${tokenName} }}`,
            'external-repository': extRepo,
            publish_branch: publishType === 'otherRepoMain' ? 'main' : 'gh-pages',
            publish_dir: buildDir,
          },
        },
      ];
      break;

    case 'privateRepo':
        steps = [
            {
                name: 'Deploy content to private repository',
                uses: 'peaceiris/actions-gh-pages@v3',
                with: {
                    'personal-token': `\${{ secrets.${tokenName} }}`,
                    publish_dir: buildDir,
                },
            },
        ];
        break;

    case 'externalService':
      steps = [
        {
          name: 'Deploy content to external service',
          run: 'npx vercel deploy --prod',
        },
      ];
      break;

    default:
      steps = [];
  }

  deployJob.steps = steps;
  return deployJob;
}

export { getDeployJob };
