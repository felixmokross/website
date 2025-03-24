import packageJson from "../../package.json";
import { Pill } from "@payloadcms/ui";
import "./version-info.scss";

export function VersionInfo() {
  return (
    <div className="version-info-container">
      <Pill pillStyle="light-gray" rounded>
        v{packageJson.version}
      </Pill>
    </div>
  );
}
