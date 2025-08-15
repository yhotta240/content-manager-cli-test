function getBuildJob(buildDir: string, jekyll: boolean) {
  if (!jekyll) {
    return undefined;
  }

  return {
    'runs-on': 'ubuntu-latest',
    steps: [
      {
        name: 'Checkout',
        uses: 'actions/checkout@v4',
      },
      {
        name: 'Setup Ruby',
        uses: 'ruby/setup-ruby@v1',
        with: {
          'ruby-version': 3.2,
        },
      },
      {
        name: 'Install dependencies',
        run: 'bundle install',
      },
      {
        name: 'Build with Jekyll',
        uses: 'actions/jekyll-build-pages@v1',
        with: {
          source: buildDir,
          destination: './_site',
        },
      },
      {
        name: 'Upload artifact',
        uses: 'actions/upload-pages-artifact@v3',
      },
    ],
  };
}

export { getBuildJob };