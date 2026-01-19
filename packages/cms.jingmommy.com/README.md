[![Netlify Status](https://api.netlify.com/api/v1/badges/5fe15505-f825-493f-bd16-85ed5096ba0e/deploy-status)](https://app.netlify.com/projects/jingmommy/deploys)

#

The DNS record has not been linked yet. Please use `https://jingmommy.netlify.app/admin` to access the CMS panel.

- site_id: (netlify) > (choose project) > Project configuration > General > Project details > `Project ID`

- (netlify)
  - (choose project) > Project configuration
    - Identify
      - Enable Identity
      - Registration > Configure
        - Invite Only
      - Invitation template
        - Configure
          - Path to template: `packages/netlify/invitation.html`
      - Confirmation template
        - Configure
          - Path to template: `packages/netlify/confirmation.html`
      - Recovery template
        - Configure
          - Path to template: `packages/netlify/password_recovery.html`
      - Email change template
        - Configure
          - Path to template: `packages/netlify/email_change.html`
    - Services
      - Enable Git Gateway
    - Build & deploy
      - Continuous deployment > Build settings
        - Build command `npm -w packages/cms.jingmommy.com run build`
        - [x] Private logs
        - [x] Stopped builds: Netlify builds consume credits, so we disable automatic builds and instead use GitHub Actions to build and deploy.

## Limitations

### Netlify Free Plan Limitations

- The Netlify free plan has a usage quota.
  If your site exceeds this quota, you may see an error message like:

  ```
  Site not available
  This site was paused as it reached its usage limits. Please contact the site owner for more information.

  If this is your site, please visit Netlify’s Billing docs page or log into your Netlify account to upgrade your plan.
  ```

- When this happens, you must wait until the next monthly cycle for your usage quota to reset, unless you upgrade your plan.
