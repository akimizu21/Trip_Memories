"use client";

import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Feature } from "geojson";
/**
 * styels
 */
import styles from "./page.module.css"


// // 都道府県ごとの訪問回数を props で受け取る
// interface Props {
//   visitData: Record<string, number>;
// }

// GeoJSONファイルのパス（publicに配置）
const geoUrl = "/japan-prefectures.geojson";

// 都道府県の出現回数を数える関数
const countPrefectures = (schedules: any[]) => {
  const counts: Record<string, number> = {};
  schedules.forEach((schedule) => {
    const prefecture = schedule.prefectures?.trim();
    if (prefecture) {
      counts[prefecture] = (counts[prefecture] || 0) + 1;
    }
  });
  return counts
}

export default function Map() {
  const [visitData, setVisitData] = React.useState<Record<string, number>>({});

  // スケジュールAPIからデータを取得し、都道府県カウントをセット
  React.useEffect(() => {
    fetch("http://localhost:8080/schedules", {
      credentials: "include",
    })
    .then((response) => response.json())
    .then((data) => {
      const counts = countPrefectures(data);
      setVisitData(counts);
    });
  }, []);

  // 色のスケールを定義
  const maxCount = Math.max(...Object.values(visitData), 1);
  const colorScale = scaleLinear<string>()
    .domain([0, maxCount])
    .range(["#e0f3f3", "#006666"]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1000px",      // 最大幅の制限（適宜調整可能）
        margin: "0 auto",        // 中央寄せ
        aspectRatio: "3 / 2",    // アスペクト比を維持（画面に収まる比率）
      }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [137, 38],
          scale: 1000,
        }}
        className={styles.mapContainer}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: Feature[] }) =>
            geographies.map((geo: Feature) => {
              const name = geo.properties?.nam_ja as string;
              const count = visitData[name] || 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(count)}
                  style={{
                    default: { 
                      outline: "none",
                      stroke: "#555",
                      strokeWidth: 0.5,
                    },
                    hover: {
                      fill: "#ffa",
                      outline: "none"
                    },
                    pressed: {
                      fill: "#f00",
                      outline: "none"
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}