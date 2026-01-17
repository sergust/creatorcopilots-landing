import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: January 17, 2026

Welcome to ${config.appName}!

These Terms of Service ("Terms") govern your use of the ${config.appName} website at https://${config.domainName} ("Website") and the services provided by ${config.appName}. By using our Website and services, you agree to these Terms.

1. Description of ${config.appName}

${config.appName} is an AI-powered video analysis platform that helps content creators understand and improve their Instagram Reels performance by analyzing retention graphs and providing actionable recommendations.

2. Service Usage and Subscriptions

When you purchase a subscription from ${config.appName}, you gain access to our video analysis services according to your selected plan. Your subscription grants you personal, non-transferable access to the service. Analysis results and recommendations generated for your content are for your personal use only and may not be resold or redistributed.

3. User Content

By uploading videos and screenshots to ${config.appName}, you grant us a limited license to process and analyze your content solely for the purpose of providing our services. You retain all ownership rights to your original content. We do not claim ownership of your uploaded materials.

4. User Data and Privacy

We collect and store user data, including name, email, and payment information, as necessary to provide our services. For details on how we handle your data, please refer to our Privacy Policy at https://${config.domainName}/privacy-policy.

5. Non-Personal Data Collection

We use web cookies to collect non-personal data for the purpose of improving our services and user experience.

6. Limitation of Liability

${config.appName} provides analysis and recommendations as guidance only. We do not guarantee specific results or outcomes from using our recommendations. The service is provided "as is" without warranties of any kind.

7. Governing Law

These Terms are governed by the laws of the United States.

8. Updates to the Terms

We may update these Terms from time to time. Users will be notified of any changes via email.

For any questions or concerns regarding these Terms of Service, please contact us at ${config.resend.supportEmail}.

Thank you for using ${config.appName}!`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
