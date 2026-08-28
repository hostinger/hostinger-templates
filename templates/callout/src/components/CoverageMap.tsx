import { BUSINESS } from '../constants/business';

export const CoverageMap = () => (
  <div className="map" aria-label="Stylised map of covered neighbourhoods">
    <svg aria-hidden="true" viewBox="0 0 490 390">
      <path
        d="M-5 63c82 24 145 5 191 30 53 29 65 94 124 106 58 13 91-38 185-10M44 405c33-74 12-138 75-168 57-28 110 1 161-49 40-39 34-101 75-151M-4 267c70-15 110-52 138-105 26-48 76-68 130-59 77 13 128-37 178-104"
        fill="none"
        stroke="#315c5c"
        strokeWidth="13"
      />
      <path
        d="M-5 63c82 24 145 5 191 30 53 29 65 94 124 106 58 13 91-38 185-10M44 405c33-74 12-138 75-168 57-28 110 1 161-49 40-39 34-101 75-151M-4 267c70-15 110-52 138-105 26-48 76-68 130-59 77 13 128-37 178-104"
        fill="none"
        stroke="#f1b764"
        strokeDasharray="3 20"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M79 125 155 166 212 116 302 151 351 103 451 129M69 329l82-54 52 50 86-28 73 49"
        fill="none"
        stroke="#527171"
        strokeWidth="3"
      />
      <g
        fill="#f5efe3"
        fontFamily="Arial"
        fontSize="12"
        fontWeight="700"
      >
        <text x="69" y="109">HIGHGATE</text>
        <text x="250" y="100">CROUCH END</text>
        <text x="131" y="218">CAMDEN</text>
        <text x="280" y="244">ISLINGTON</text>
        <text x="347" y="309">HACKNEY</text>
      </g>
      <g transform="translate(241 177)">
        <path
          d="M0-42c-22 0-40 18-40 40 0 31 40 67 40 67S40 29 40-2c0-22-18-40-40-40Z"
          fill="#ee744a"
          stroke="#f5efe3"
          strokeWidth="5"
        />
        <circle cy="-3" fill="#f5efe3" r="13" />
      </g>
    </svg>
    <span className="map-note">Based in {BUSINESS.location}</span>
  </div>
);
