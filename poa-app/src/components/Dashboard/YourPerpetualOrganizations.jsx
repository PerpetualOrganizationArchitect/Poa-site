// Usage in a parent component
import Organization from "./Organization";
import { organizations } from "./TempOrgData";

const YourPerpetualOrganizations = () => {
  return (
    <div>
      {organizations.map((org, index) => (
        <Organization
          key={index}
          title={org.title}
          membership={org.membership}
          status={org.status}
          dateJoined={org.dateJoined}
          logoUrl={org.logoUrl}
          href={org.href}
        />
      ))}
    </div>
  );
};

export default YourPerpetualOrganizations;
