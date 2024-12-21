export const runScript = async <R>(func: () => Promise<R> | R) => {
  console.log("🏁 Running script...");
  try {
    const result = await func();
    console.log(
      "✅ Script ran successfully. Result:",
      JSON.stringify(result, null, 2)
    );
  } catch (error) {
    console.error("❌ Script failed. Error:", error);
  }
  console.log("🏁 Script finished running.");
  process.exit(0);
};
