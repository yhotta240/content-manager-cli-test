import { dump } from 'js-yaml';
import type { GhPagesOptions } from "../types/gh-pages";
import { getBuildJob } from "./build.js";
import { getDeployJob } from "./deploy.js";

function getGhPagesWorkflow(contentDir: string, options: GhPagesOptions): string {
  const { branch, buildDir, publishType, extRepo, tokenName, jekyll } = options;

  if (buildDir) {
    contentDir = buildDir;
  }

  const buildJob = getBuildJob(contentDir, jekyll);
  const deployJob = getDeployJob(publishType, contentDir, extRepo, tokenName, jekyll);

  const jobs: any = {};

  if (buildJob) {
    jobs.build = buildJob;
  }
  jobs.deploy = deployJob;

  const workflow: any = {
    name: 'Deploy content to GitHub Pages',
    on: {
      push: {
        branches: [branch],
        paths: [`${contentDir}/**/*`, '.github/workflows/**'].filter(Boolean),
      },
      workflow_dispatch: null,
    },
    permissions: {
      contents: publishType === 'sameRepoMain' ? 'read' : 'write',
      pages: 'write',
      'id-token': 'write',
    },
    jobs: jobs,
  };

  const yaml = dump(workflow, { noCompatMode: true });
  return yaml.replace('workflow_dispatch: null', 'workflow_dispatch:');
}

export { getGhPagesWorkflow };